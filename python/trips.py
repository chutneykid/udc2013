import sys
import pandas
import numpy 
import os.path
sys.path.append("..")    

columns = ['TRIP_ID', 'ROUTE', 'DIR', 'STOP_ID', 'TIMESTOP', 'ON', 'OFF', 'LOAD', 'DATE', 'LATITUDE', 'LONGITUDE']

# New data frame
data = pandas.read_csv('data/sf/sf-passenger-count.csv', names=columns)


# Check the columns
print data.columns
# Check the first row 
print data.ix[1]

# Filter by one day

print "\nFilter to one route on one day:\n"
monday = data[data.DATE == "10/4/12"]
#print monday
route1 = monday[monday.ROUTE == "1"]
print route1

# Out put the entire table
# print route1.to_string()

# Iterate over every row
# for row_index, row in route1.iterrows():
#    print '%s\n%s' % (row_index, row)

