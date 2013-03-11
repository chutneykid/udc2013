import sys
import pandas as pd
import os.path
sys.path.append("..")

print pd.__version__
    

data = pd.read_csv('data/sf/sf-passenger-count.csv', names=['TRIP_ID', 'ROUTE', 'DIR', 'STOP_ID', 'TIMESTOP', 'ON', 'OFF', 'LOAD', 'DATE', 'LATITUDE', 'LONGITUDE'])

data.groupby('ROUTE').ON.sum()
data.tail()

print data

# total num of passengers
#total_passengers = data.pivot('ON', rows='ROUTE', cols='ROUTE', aggfunc=sum)
#total_passengers.tail()
