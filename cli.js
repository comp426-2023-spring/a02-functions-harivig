#!/usr/bin/env node

import minimist from 'minimist'
import moment from 'moment-timezone'
import fetch from 'node-fetch';

const args = minimist(process.argv.slice(2));

if (args.h) {
	console.log(`Usage: galosh.js [options] -[n|s] LATITUDE -[e|w] LONGITUDE -z TIME_ZONE
    -h            Show this help message and exit.
    -n, -s        Latitude: N positive; S negative.
    -e, -w        Longitude: E positive; W negative.
    -z            Time zone: uses tz.guess() from moment-timezone by default.
    -d 0-6        Day to retrieve weather: 0 is today; defaults to 1.
    -j            Echo pretty JSON from open-meteo API and exit.`);
	process.exit(0);
}

const timezone = args.z || moment.tz.guess();
const longitude = args.e || args.w * -1;
const latitude = args.n || args.s * -1;
const day = args.d || 1;

//makes the request
const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude='+latitude+'&longitude='+longitude+'&timezone='+timezone+'&daily=precipitation_hours&current_weather=true');

const data = await response.json();
const days = args.d

if (args.j) {
    console.log(data);
    process.exit(0);
  }

  let output = ""

  if (data.daily.precipitation_hours[days] > 0) {
    output += "You might need your galoshes "
  } else {
    output += "You will not need your galoshes "
  }

  if (days == 0) {
    output += "today."
  } else if (days > 1) {
    output += "in " + days + " days."
  } else {
    output += "tomorrow."
  }

  console.log(output)