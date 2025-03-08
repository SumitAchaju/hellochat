#!/bin/bash

SESSION_NAME="my_session"

# Commands to run in the panes
DJANGO_SERVER="cd django && . .venv/bin/activate && python manage.py runserver"
EXPRESS_SERVER="cd socket && npm run dev"
REACT_SERVER="cd ui && npm run dev"

# Check if the tmux session exists
if tmux has-session -t "$SESSION_NAME" 2>/dev/null; then
  tmux kill-session -t "$SESSION_NAME"
fi
echo "Creating new session: $SESSION_NAME"
tmux new-session -d -s "$SESSION_NAME"

tmux split-window -h -t "$SESSION_NAME"
tmux split-window -v -t "$SESSION_NAME"

# Send the commands to the panes
tmux send-keys -t "$SESSION_NAME:0.0" "$DJANGO_SERVER" C-m
tmux send-keys -t "$SESSION_NAME:0.1" "$EXPRESS_SERVER" C-m
tmux send-keys -t "$SESSION_NAME:0.2" "$REACT_SERVER" C-m

# Attach to the session
tmux attach-session -t "$SESSION_NAME"
