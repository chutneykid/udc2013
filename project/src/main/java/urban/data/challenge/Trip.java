package urban.data.challenge;

import java.sql.*;

import javax.ws.rs.GET;
import javax.ws.rs.Produces;
import javax.ws.rs.Path;
import javax.servlet.*;

import org.springframework.stereotype.Controller;

import java.io.FileInputStream;
import java.io.IOException;
import java.util.Properties;

import java.text.SimpleDateFormat;
import java.util.Collection;
import java.util.Date;
import java.util.ArrayList;
import java.util.List;

import java.io.FileWriter;
import com.google.gson.Gson;

public class Trip {

	public String tripID;
	public String firstStop;
	public String departs;
	
	Collection coordinates = new ArrayList();

	public Trip(String route_id, String stop_id) {
		Properties config = new Properties();

		/*
		System.out.println(route_id + " , " +  stop_id);
    	try {
    		config.load(new FileInputStream("config.properties"));

    	} catch (IOException ex) {
    		ex.printStackTrace();
    	} */
    	
	    try {
	      // load the driver into memory
	      Class.forName("org.relique.jdbc.csv.CsvDriver");

	      // create a connection. The first command line parameter is assumed to
	      //  be the directory in which the .csv files are held
	      	      
	      String path = Trip.class.getProtectionDomain().getCodeSource().getLocation().toString();
	      System.out.print(path);
	      //String path2 = path.substring(0, path.indexOf("/webapp")) + "/data/events/images/";

	      System.out.println(path);

	      Connection conn = DriverManager.getConnection("jdbc:relique:csv:/Users/stevepepple/Dropbox/development/urban-data-challenge/git-udc2013/project/src/main/java/urban/data/challenge/db");

	      // create a Statement object to execute the query with
	      Statement stmt = conn.createStatement();
	      
	      /* TODO: Check inbound vs. outbound */
	      String getRoute = "SELECT * FROM sf-stop-times WHERE STOP_SEQUENCE = '1' AND ROUTE_ID = '" + route_id + "'";
	    	  
	      ResultSet results = stmt.executeQuery(getRoute);
	      
	      ResultSetMetaData meta = results.getMetaData();

	      System.out.println("Columns: ");
	      for (int i = 0; i < meta.getColumnCount(); i++) {
	          System.out.println("\t" + meta.getColumnName(i + 1));
	      }
	      
	      /* Assume Current Time*/
	      Date current = new Date();
	      SimpleDateFormat df = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss");

	      // dump out the results
	      long shortest = 0;
	      Date nextTime = null;
	      String nextTrip = null;
	      String nextStop = null;

	      while (results.next()){

	    	Date date = (Date) df.parse("06/03/2013 " + results.getString("arrival_time"));  
	        	
	        long diff = date.getTime() - current.getTime();
	        	
	        if (shortest == 0 || diff < shortest) {
	        	shortest = diff;
	        	nextTime = date;
	        	nextTrip = results.getString("trip_id");
	        	nextStop = results.getString("stop_id");
	        	System.out.println("ROUTE = " + results.getString("route_id") + " SEQ = " + results.getString("stop_sequence") + " " + results.getString("arrival_time") );
	        }
	      }

	      SimpleDateFormat time = new SimpleDateFormat("HH:mm:ss");
	      String stopTime = time.format(nextTime.getTime());
	      
	      System.out.println("-----------------");
	      System.out.println("Next trip is: " + stopTime + " on trip " + nextTrip + " at stop " + nextStop);
	      System.out.println("-----------------");
	      this.firstStop = nextStop;
	      this.tripID = nextTrip;
	      this.departs = stopTime;

	      /* Fetch All Stops for the Selected Trip */
	      Statement stmt2 = conn.createStatement();
	      ResultSet stops = stmt2.executeQuery("SELECT STOP_ID FROM sf-stop-times WHERE TRIP_ID = '" + nextTrip + "'");
	      
	      /* TODO: Fetch Trip Info */
	      /* TODO: Fetch Each Stop */
	      Statement getStop = conn.createStatement();
	      while (stops.next()){
	    	  String stop = stops.getString("stop_id");
	    	  //System.out.println("STOP_ID = " + stop);
		      ResultSet coords = getStop.executeQuery("SELECT STOP_ID, STOP_LAT, STOP_LON FROM stops WHERE STOP_ID = '" + stop + "'");
		      while (coords.next()){
		    	  String lat = coords.getString("STOP_LAT");
		    	  String lon = coords.getString("STOP_LON");
		    	  //this.coordinates.add(lat);
		    	  this.coordinates.add(lat + ", " + lon);
		      }
	      }
	      
	      // clean up
	      results.close();
	      stmt.close();
	      conn.close();
	    }
	    catch(Exception e) {
	      e.printStackTrace();
	    }
	}
	
	public static void main(String args[]) {
		Trip trip = new Trip("5998", "4015");

		Gson gson = new Gson();
		String json = gson.toJson(trip);

		System.out.print(json);
	
	}


}
