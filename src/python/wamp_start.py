import os
import sys

def start_wamp(command: str) -> int:
    try:
        exit_code = os.system(command)
        return exit_code
    except Exception as e:
        print(f'An error occured: {e}')
        return -1

if len(sys.argv) != 2:
    print("Usage: python app_start.py <path_to_wamp_exe>")
    sys.exit(1)

command = sys.argv[1]
exit_code = start_wamp(command)
print(f'Command executed with exit code: {exit_code}')