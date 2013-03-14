# -*- coding: utf-8 -*-
# <nbformat>3.0</nbformat>

# <codecell>

import sys
import pandas
import numpy 
import os.path
sys.path.append("..")    

# New data frame
data = pandas.read_csv('data/sf/sf-passenger-count.csv', header=0)
data.tail()

# <codecell>

passengers_on = data.drop(['DIR', 'STOP_ID', 'STOP_SEQ', 'TIMESTOP', 'OFF', 'DATE', 'LATITUDE', 'LONGITUDE'], axis=1)

passengers_on = passengers_on[data.DATE == "10/1/12"]

totals = passengers_on.groupby('ROUTE').ON.sum();
totals.head(10)

# <codecell>


