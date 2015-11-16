Adknowledge - Use Case 1 – Weather Trails – Team Turingery

Our team choose Adknowledge Use Case 1 as our project for the Hackathon.  We 
were excited for the opportunity to work with variety of APIs and take a 
problem that had a lot of underlying complexity.  

Our application prompts a user for a start location and end location.  The 
user also has the ablility to modify the trip start time which we default to 
current time.  The application then provides a visual representation of the 
route of travel, gives current long-range forecasts at both origin and 
destination, and then provides hourly weather along the route.
To determine the weather along the route of travel, we hypothesized two 
potential approaches.  

   1)   Utilize information received from the Google Directions API and aggregate 
        it to get locations for the Forecast.io API to provide weather.
        
        a.  For this approach we determined the base algorithm would be:
            
            i.   Transmit start and stop locations to Google Directions – 
                 this results in a route which is composed of steps.
                 
                 1.    For each step you have a latitude, longitude, and duration.
                 
            ii.  Iterate through steps, adding durations until you reach a 
                 relevant amount of time – we choose 1 hour.  
                 
            iii. Query the Forecast.io API and get weather based on the 
                 time and location for this closest step.
                 
            iv.  Repeat until you have processed all of the steps.
        b.  This gives you most accurate geographic locations for your weather data.  
        
        c.  The challenge of this approach is when you have long trip steps.  
            For example, a trip from Kansas City to Denver has an extended stretch on 
            I-70 where you would not have a latitude and longitude to pull data.

   2)   Utilize the start and stop coordinates to generalize waypoints to provide 
        to the Forecast.io API to get more generalized weather details.  
        
        a.  For this approach we determined the base algorithm would be:
        
            i.   Calculate the number of weather “points” by dividing trip duration 
                 by 3600 (number of seconds in an hour).
                 
            ii.   Calculate intermediate points (using latitude as example)
            
                 1.   DestinationLatitude – OriginLatitude = TripLatitudeChange
                 
                 2.   Loop from 0 to total number of points using index i
                 
                     a.    Latitude[i] = ( i * TripLatitudeChange)/points + OriginLatitude
                     
                 3.   For this point the time is base time + (3600 * i)
                 
            iii.  Iterate through points calling Forecast.io API and get weather for each point.
            
	b.   Taking this approach ensures that you have weather for each critical time element.   
	
	c.   The challenge of this approach is on routes where the trip deviates greatly 
	     from a straight line.  For example, a trip from Kansas City to Las Vegas is much 
	     more of a rotated “L” route of travel.
	     
We believe that the best approach would be a combination of these two approaches – utilizing 
method 1 as the primary method, and if the duration of step exceeds our time window, switching 
to method 2 for that step.  However, given the time constraints of this Hackathon, we needed to 
go with one approach.  We chose to go with the second approach because we could guarantee the 
time increments and we believe that as long as we are in the geographic “ball park” the weather 
information should be relevant – especially for trips less than 8 hours in length (what we believe 
to be a reasonable driving distance for 1 day).

APIs used:

•	Forecast.io

•	Google Maps/Places

•	Google Directions

•	Google Geocoding

Services used

•	IBM Bluemix

Technologies Used

•	MongoDB

•	AJAX

•	Ionic

•	AngularJS

•	Java

*Note - our application requires the Chrome plug-in: Cors.
