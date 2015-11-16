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
 * Servlet implementation class UserServices
 */
@WebServlet("/UserServices")
public class UserServices extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
	MongoClientURI uri;
	MongoClient client;
	DB userDataBase;
	DBCollection usersList;
	BasicDBObject user;
	int cnt=0;
    public UserServices() {
        super();
        uri = new MongoClientURI("mongodb://admin:password@ds053764.mongolab.com:53764/doraadatabase");
		client = new MongoClient(uri);
		userDataBase = client.getDB(uri.getDatabase());
		usersList = userDataBase.getCollection("travellers");
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		String userNameToFetch;
		user=null;
		if(request.getAttribute("userName")!=null)
		userNameToFetch = request.getAttribute("userName").toString();
		else
		userNameToFetch=request.getParameter("userName");
		response.setHeader("Access-Control-Allow-Origin","*");
		response.setHeader("Access-Control-Allow-Methods","GET,POST,DELETE,PUT,OPTIONS");
		response.setHeader("Access-Control-Allow-Headers","Content-Type");
		response.setHeader("Access-Control-Max-Age","86400");
		if(userNameToFetch!=null && !userNameToFetch.equals("")){
		BasicDBObject queryToSearchUser = new BasicDBObject("userName",userNameToFetch);
		user=(BasicDBObject) usersList.findOne(queryToSearchUser);
		
		if(user!=null && user.get("status").toString().toUpperCase().equals("ACTIVE")&& request.getAttribute("userName")==null ){
			//This is to increment the user login count by 1 every time he logs in and his status is active.
			BasicDBObject userDataToUpdate = new BasicDBObject();
			userDataToUpdate.append("$inc", new BasicDBObject().append("uerLoginCount", 1));
			WriteResult result = usersList.update(user, userDataToUpdate);
			if(result!=null)
		response.getWriter().write(user.toString());
		}
		else 
		{
			if(request.getAttribute("userName")==null)
			response.getWriter().write("User not present");
		}
		}
		else
		{
			DBCursor frequentUsers = usersList.find().sort(new BasicDBObject("uerLoginCount", -1));
			response.getWriter().write(frequentUsers.toArray().toString());
		}
		
		
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		try{
		StringBuilder buffer = new StringBuilder();
		BufferedReader userDataReader = request.getReader();
		String userData;
		String actionToBePerformed=(request.getParameter("deactivate")!=null)?"deactivateUser":"addUser";
		while((userData=userDataReader.readLine())!=null)
			buffer.append(userData);
		String reqData = buffer.toString();
		JSONObject userToBeAdded = new JSONObject(reqData);
		BasicDBObject userToAdd = new BasicDBObject();
	
		for(Object key:userToBeAdded.keySet().toArray())
			userToAdd.put(key.toString(),userToBeAdded.get(key.toString()));

		response.setHeader("Access-Control-Allow-Origin","*");
		response.setHeader("Access-Control-Allow-Methods","POST,OPTIONS,PUT,GET");
		response.setHeader("Access-Control-Allow-Headers","Content-Type");
		response.setHeader("Access-Control-Max-Age","86400");		

		if(userToAdd!=null && userToAdd.get("userName")!=null)
		{
			request.setAttribute("userName", userToAdd.get("userName"));
			doGet(request,response);
			if(user!=null)
			{
				if(actionToBePerformed!=null && !actionToBePerformed.equals("") ){
					
					if(actionToBePerformed.equals("addUser")){
					response.getWriter().write("User already present");
					}
					else
					{
						BasicDBObject userDataToDeactivate = new BasicDBObject();
						userDataToDeactivate.append("$set", new BasicDBObject().append("status", "Deactive"));
						WriteResult result = usersList.update(user, userDataToDeactivate);
						response.getWriter().write(result.toString());
					}	
					
				
				}
				
			}
			else
			{
			WriteResult result=usersList.insert(userToAdd);
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
