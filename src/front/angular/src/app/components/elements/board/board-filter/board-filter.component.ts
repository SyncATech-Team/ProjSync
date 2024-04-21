import {Component, OnInit} from '@angular/core';
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import {FormControl} from "@angular/forms";
import {ProjectQuery} from "../../../state/project/project.query";
import {FilterQuery} from "../../../state/filter/filter.query";
import {FilterService} from "../../../state/filter/filter.service";
import {debounceTime, distinctUntilChanged} from "rxjs";
import {JUser} from "../../../../_models/user-issues";
import {AccountService} from "../../../../_service/account.service";

@Component({
  selector: 'board-filter',
  templateUrl: './board-filter.component.html',
  styleUrl: './board-filter.component.css'
})
@UntilDestroy()
export class BoardFilterComponent implements OnInit {
  searchControl: FormControl = new FormControl('');
  userIds: string[];

  constructor(
    public projectQuery: ProjectQuery,
    public filterQuery: FilterQuery,
    public filterService: FilterService,
    private accountService: AccountService
  ) {
    this.userIds = [];
  }

  ngOnInit(): void {
    this.searchControl.valueChanges
      .pipe(debounceTime(100), distinctUntilChanged(), untilDestroyed(this))
      .subscribe((term) => {
        this.filterService.updateSearchTerm(term);
      });

    this.filterQuery.userIds$.pipe(untilDestroyed(this)).subscribe((userIds) => {
      this.userIds = userIds;
    });
  }

  isUserSelected(user: JUser) {
    return this.userIds.includes(user.id);
  }

  ignoreResolvedChanged() {
    this.filterService.toggleIgnoreResolve();
  }

  onlyMyIssueChanged() {
    this.resetAll();
    var userId = this.accountService.getCurrentUser()?.id;
    this.filterService.toggleUserId(userId!.toString());
  }

  userChanged(user: JUser) {
    this.filterService.toggleUserId(user.id);
  }

  resetAll() {
    this.searchControl.setValue('');
    this.filterService.resetAll();
  }
}
