# Quick Start guide

## Quickly spin up a local docker server

```
cp ./instance/example.app.conf ./instance/app.conf # Update values
cp example.env .env # use corresponding db values from app.conf in .env
./scripts/run_local.sh
```

## Run flask locally (outside of docker)
Must have installed PostgreSQL development libraries required to compile a package from source (the psycopg2 Python library). 
```
# For Debian/Ubuntu-based systems:
sudo apt update
sudo apt install libpq-dev python3-dev

# For Red Hat/CentOS/Fedora-based systems:
sudo yum install postgresql-devel
# or for newer Fedora/CentOS Stream
sudo dnf install postgresql-devel

# For macOS (using Homebrew):
brew install postgresql
```

In python virtual environment:
```
pip install -r requirements.txt
```

Then start your local flask server. Can use the following config for vs code:
```
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Python Debugger: Flask",
      "type": "debugpy",
      "request": "launch",
      "module": "flask",
       "python": "/Users/username/.pyenv/versions/3.12.9/envs/nameofenv/bin/python",
      "env": {
        "FLASK_APP": "server/wsgi.py",
        "FLASK_DEBUG": "1"
      },
      "args": [
        "run",
        "--no-debugger",
        "--no-reload"
      ],
      "jinja": true,
      "autoStartBrowser": false
    }
  ]
}
```