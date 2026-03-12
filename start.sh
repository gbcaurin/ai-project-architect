#!/bin/bash
echo "Starting AI Project Architect..."
echo ""
echo "Backend: http://localhost:8000"
echo "Frontend: http://localhost:5173"
echo ""

# Start backend
cd backend
uvicorn main:app --reload --port 8000 &
BACKEND_PID=$!

# Start frontend  
cd ../frontend
npm run dev &
FRONTEND_PID=$!

echo "Both servers running. Press Ctrl+C to stop."
wait $BACKEND_PID $FRONTEND_PID
