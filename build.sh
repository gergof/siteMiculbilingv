#!/bin/bash
trap "exit 1" TERM
export TOP_PID=$$

# log(message, level)
function log {
	if [ "$2" == "ERROR" ]; then
		COLOR="\e[31m"
	elif [ "$2" == "QUESTION" ]; then
		COLOR="\e[34m"
	else
		COLOR="\e[32m"
	fi

	echo -e "${COLOR}=> $1\e[0m"
}

# execute(command and args)
function execute {
	echo -e "\e[33m+ $@\e[0m"
	$@
	EXIT_CODE=$?
	if [ $EXIT_CODE -ne 0 ]; then
		log "Command failed with exit code $EXIT_CODE" ERROR
		kill -s TERM $TOP_PID
	fi
}

log "=== Building siteMiculbilingv ==="

log "Installing deps for frontend"
execute cd frontend
execute npm ci
execute cd ..

log "Installing deps for backend"
execute cd backend
execute composer.phar install --optimize-autoloader --no-dev
execute cd ..

log "Building frontend"
execute cd frontend
execute npm run build
execute cd ..

log "Copying frontend artifacts"
execute cp frontend/build/index.blade.php backend/resources/views/
execute cp frontend/build/index.js backend/public/

log "Creating bundle"
execute tar -czf dist.tar.gz -C backend .

log "[Done]"
