#!/bin/bash
echo "Starting AI Project Architect..."
echo ""
echo "Backend: http://localhost:8000"
echo "Frontend: http://localhost:5173"
echo ""

# Start backend
cd backend
uvicorn main:app --reload

# Start frontend  
cd ../frontend
npm run dev

echo "Both servers running. Press Ctrl+C to stop."

