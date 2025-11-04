#!/bin/bash

echo "BGP Members Management Setup Script"
echo "======================================"

# Check if .env exists, if not create from example
if [ ! -f backend/.env ]; then
    echo "Creating backend .env file..."
    cp .env.example backend/.env
    echo "Backend .env created. Please update it with your actual values."
else
    echo "Backend .env already exists"
fi

# Check if frontend .env.local exists
if [ ! -f frontend/.env.local ]; then
    echo "Creating frontend .env.local file..."
    echo "REACT_APP_API_URL=http://localhost:5000" > frontend/.env.local
    echo "Frontend .env.local created"
else
    echo "Frontend .env.local already exists"
fi

# Install dependencies
echo ""
echo "Installing dependencies..."
echo "Installing root dependencies..."
npm install

echo "Installing backend dependencies..."
cd backend && npm install && cd ..

echo "Installing frontend dependencies..."
cd frontend && npm install && cd ..

echo ""
echo "Setup complete!"
echo ""
echo "Next steps:"
echo "1. Update backend/.env with your database credentials"
echo "2. Make sure MySQL is running"
echo "3. Run the database setup: cd backend && node database/setup.js"
echo "4. Start the development servers: npm run dev"
echo ""
echo "Default admin credentials will be created:"
echo "Email: admin@bgpnc.com"
echo "Password: admin123 (change this immediately after first login)"