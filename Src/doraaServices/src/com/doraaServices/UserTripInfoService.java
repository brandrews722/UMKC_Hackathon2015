package com.doraaServices;

import java.io.BufferedReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONObject;

import com.mongodb.BasicDBObject;
import com.mongodb.DB;
import com.mongodb.DBCollection;
import com.mongodb.DBCursor;
import com.mongodb.DBObject;
import com.mongodb.MongoClient;
import com.mongodb.MongoClientURI;
import com.mongodb.WriteResult;

/**
 * Servlet implementation class TipInfoService
 */
@WebServlet("/UserTripInfoService")
public class UserTripInfoService extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
	MongoClientURI uri;
	MongoClient client;
	DB userDataBase;
	DBCollection tripList;
	
	int cnt=0;
    public UserTripInfoService() {
        super();
        // TODO Auto-generated constructor stub
        uri = new MongoClientURI("mongodb://admin:password@ds053764.mongolab.com:53764/doraadatabase");
		client = new MongoClient(uri);
		userDataBase = client.getDB(uri.getDatabase());
		tripList = userDataBase.getCollection("previousTrips");
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		String userNameToFetch;
	userNameToFetch=request.getParameter("userName");
	BasicDBObject queryToSearchUserTrips = new BasicDBObject("userName",userNameToFetch);
	
	DBCursor userTrips= tripList.find(queryToSearchUserTrips);
	
		response.setHeader("Access-Control-Allow-Origin","*");
		response.setHeader("Access-Control-Allow-Methods","GET,POST,DELETE,PUT,OPTIONS");
		response.setHeader("Access-Control-Allow-Headers","Content-Type");
		response.setHeader("Access-Control-Max-Age","86400");
		//Returning a frequency sorted list of recent trips.
		if(userTrips!=null && userTrips.count()>0){
			userTrips = userTrips.sort(new BasicDBObject("tripCount", -1));
		response.getWriter().write(userTrips.toArray().toString());
		}
		else 
		{
			response.getWriter().write("No trips taken.");
		}

	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		try{
		StringBuilder buffer = new StringBuilder();
		BufferedReader userDataReader = request.getReader();
		String userData;
		while((userData=userDataReader.readLine())!=null)
			buffer.append(userData);
		String reqData = buffer.toString();
		JSONObject userTrip = new JSONObject(reqData);
		BasicDBObject userTripToAdd = new BasicDBObject();
		for(Object key:userTrip.keySet().toArray())
			userTripToAdd.put(key.toString(),userTrip.get(key.toString()));

		response.setHeader("Access-Control-Allow-Origin","*");
		response.setHeader("Access-Control-Allow-Methods","POST,OPTIONS,PUT,GET");
		response.setHeader("Access-Control-Allow-Headers","Content-Type");
		response.setHeader("Access-Control-Max-Age","86400");		
		//search for the trip in the collection.
		if(userTripToAdd!=null && userTripToAdd.get("userName")!=null)
		{
			List<BasicDBObject> userTripQueryFields = new ArrayList<BasicDBObject>();
			userTripQueryFields.add(new BasicDBObject("userName",userTripToAdd.get("userName")));
			userTripQueryFields.add(new BasicDBObject("source",userTripToAdd.get("source")));
			userTripQueryFields.add(new BasicDBObject("destination",userTripToAdd.get("destination")));
			BasicDBObject userTripQuery = new BasicDBObject();
			userTripQuery.put("$and", userTripQueryFields);
			BasicDBObject userTripInDatabase=(BasicDBObject) tripList.findOne(userTripQuery);
			
			//If the trip already exists then increment its count and update the date and time to the latest.
			if(userTripInDatabase!=null)
			{ 
				int tripCount = Integer.parseInt(userTripInDatabase.get("tripCount").toString());
				tripCount++;
				userTripToAdd.put("tripCount",tripCount );
						userTripInDatabase.put("startDate", userTripToAdd.get("startDate"));
						userTripInDatabase.put("startTime", userTripToAdd.get("startTime"));
						userTripInDatabase.put("tripCount",userTripToAdd.get("tripCount"));					
						WriteResult result = tripList.save(userTripInDatabase);
						response.getWriter().write(result.toString());
			
			}
			else
			{
			//Defaulting the count to 1 when we insert the search query for the first time.
			userTripToAdd.put("tripCount", 1);
			WriteResult result=tripList.insert(userTripToAdd);
			response.getWriter().write(result.toString());
			}	
		}
		
		}
		catch(Exception ex)
		{ 
			String exception = ex.getMessage();
			response.getWriter().write(exception);
		}
	}
	public void destroy() 
	{
		client.close();
	}

}
