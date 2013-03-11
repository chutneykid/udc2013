package urban.data.challenge.rest;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.servlet.*;

import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

import com.google.gson.Gson;

import urban.data.challenge.Trip;

/* 8080/rest/stop-service/<city>/{route}/{direction}/{stop} 
 * http://www.mkyong.com/webservices/jax-rs/jax-rs-pathparam-example/
 */
@Path("/stop-service")
public class StopService {
 
	@GET
	@Path("{city}/{route}/{direction}/{stop}")
	public Response getMsg(
			@PathParam("city") String city,
			@PathParam("route") String route, 
			@PathParam("direction") String direction, 
			@PathParam("stop") String stop) {

		/*
		String relativeWebPath = "/resources";
		ApplicationContext context = new ClassPathXmlApplicationContext("Spring-Module.xml");
		 
		Trip trip = (Trip) context.getBean("trip");
		*/

		Trip trip = new Trip (route, stop);
		Gson gson = new Gson();
		String json = gson.toJson(trip);
		

		//	String output = "city : " + city + ", " + route;
 
	    return Response.ok(json, MediaType.APPLICATION_JSON).build();

 
	}
 
}