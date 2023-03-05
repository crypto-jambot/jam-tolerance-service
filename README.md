# JAM Tolerance Service
Confirms our block count is accurate. If it is not it scales down our 
listening service so we are not sending stale data. Once our block count is caught
up the service does the opposite. Takes previous state metadata for scaling
constant.