import { NextResponse } from 'next/server';

export async function GET() {
  const weatherData = {
    DATE: new Date().toISOString(),
    MAX_TEMP: 85,
    AVG_WIND_SPEED: 15,
    LAGGED_PRECIPITATION: 0.1,
    WIND_TEMP_RATIO: 0.18
  };

  return NextResponse.json(weatherData);
} 