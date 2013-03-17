import math


def distance(lat1, lon1, lat2, lon2):
	# return distance in miles, and kilometers
	unit_distance = distance_on_unit_sphere(lat1, lon1, lat2, lon2) 

	# need to multiply by 3690 for distance in miles, 6373 for distance in km.
	# return an array with [dist in miles, dist in km]
	print str(unit_distance*3960) + " miles, " + str(unit_distance*6373) + " km"
	return [unit_distance*3960, unit_distance*6373]



def distance_on_unit_sphere(lat1, long1, lat2, long2):

    # Convert latitude and longitude to 
    # spherical coordinates in radians.
    degrees_to_radians = math.pi/180.0
        
    # phi = 90 - latitude
    phi1 = (90.0 - lat1)*degrees_to_radians
    phi2 = (90.0 - lat2)*degrees_to_radians
        
    # theta = longitude
    theta1 = long1*degrees_to_radians
    theta2 = long2*degrees_to_radians
        
    # Compute spherical distance from spherical coordinates.
        
    # For two locations in spherical coordinates 
    # (1, theta, phi) and (1, theta, phi)
    # cosine( arc length ) = 
    #    sin phi sin phi' cos(theta-theta') + cos phi cos phi'
    # distance = rho * arc length
    
    cos = (math.sin(phi1)*math.sin(phi2)*math.cos(theta1 - theta2) + 
           math.cos(phi1)*math.cos(phi2))
    arc = math.acos( cos )

    # Remember to multiply arc by the radius of the earth 
    # in your favorite set of units to get length.
    return arc

# For longitude, East has a positive value, West has a negative one.
# For latitude, North is positive, South is negative.
# The distance below is the distance between San Francisco, and Zurich (as the crow flies)
distance(37.6190, -122.3749, 47.3690, 8.5380)