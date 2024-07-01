#!/bin/bash

if [[ "$OSTYPE" == "linux-gnu"* || "$OSTYPE" == "darwin"* ]]; then
    # Linux or macOS
    export FLASK_APP=app/routes.py
    export FLASK_DEBUG=1
    export FLASK_ENV=development
    flask run
elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" ]]; then
    # Git Bash or Cygwin on Windows
    export FLASK_APP=app/routes.py
    export FLASK_DEBUG=1
    export FLASK_ENV=development
    flask run
elif [[ "$OSTYPE" == "win32" ]]; then
    # Native Windows
    set FLASK_APP=app/routes.py
    set FLASK_DEBUG=1
    set FLASK_ENV=development
    flask run
else
    echo "Unsupported OS"
    exit 1
fi
