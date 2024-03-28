import os
import sys

def start_app(directory: os.PathLike, command: str) -> int:
    try:
        os.chdir(directory)
        exit_code = os.system(command)
        return exit_code
    except Exception as e:
        print(f'An error occured: {e}')
        return -1

def start_wamp(exeFilePath):
    pass

if len(sys.argv) != 3:
    print("Usage: python app_start.py <directory> <command>")
    sys.exit(1)
    
directory = sys.argv[1]
command = sys.argv[2]
exit_code = start_app(directory, command)
print(f'Command executed with exit code: {exit_code}')