export const quillConfiguration = {
  toolbar: [
    ['bold', 'italic', 'underline', 'strike'],
    ['blockquote', 'code-block'],
    // [{ list: 'ordered' }, { list: 'bullet' }], //komentarisano jer ne radi trenutno
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ color: [] }, { background: [] }], 
    [{ align: [] }], 
    [{ indent: '-1' }, { indent: '+1' }],
    [{ direction: 'rtl' }],
    [{ font: [] }], 
    [{ size: ['small', false, 'large', 'huge'] }],
    [{ script: 'sub' }, { script: 'super' }],
    ['clean'] 
  ]
};
