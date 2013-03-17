import json

# Currently this is only for Geneva.


data_path = "/home/sashok/Desktop/udc/data/public-transportation/geneva/geo/geojson/stops.json"

# Load the file from the data path into a string, then json parse it.
stops_data = open(data_path)
data = json.load(stops_data)


# Define an empy dictionary. The structure of the dictionay is going to be stopCode -> list of routes that service that stop.
stops_routes_dict = dict()

# Define another dictionary that maps from the stopCode to it's latitude and longitude.
stops_latlon_dict = dict()


# Iterate through stops_data and populate the dictionaries.

# Get the "features" part of the stops file. This will be a list of features
features_data = data["features"]

for feature in features_data:
	curr_stopcode = feature["properties"]["stopCode"] 
	
	# curr_latlong will be a list
	curr_latlong = feature["geometry"]["coordinates"]

	# Get the route that services this stopcode
	curr_routecode = feature["properties"]["routeCode"]

	if stops_latlon_dict.get(curr_stopcode) is None:
		stops_latlon_dict[curr_stopcode] = curr_latlong

	if stops_routes_dict.get(curr_stopcode) is None:
		stops_routes_dict[curr_stopcode] = [curr_routecode]
	else:
		stops_routes_dict[curr_stopcode].append(curr_routecode)

'''
Now what we have left here is a mapping from the the stopcode -> list of routes that serve that stopcode
and a mapping from the stopcode to the latitude and longitude of that stop.

So far this works only for Geneva.
'''

