from jira import JIRA
import pandas as pd
from datetime import datetime
import numpy as np
import time
from datetime import datetime
 
##Create empty DataFrame
columns = ['Issue Key', 'Created', 'Mac', 'Module', 'Model Name', 'Platform', 'Soc', 'Version', 'Country', 'Prosense Type', 'Market', 'Status', 'Summary', 'Assignee', 'Reporter', 'Priority', 'Serial Number']
df = pd.DataFrame(columns=columns)                    
print(type(df))
 
##JIRA sever connection
ad_id = 'jiu.myeoung'
ad_pw = 'audwldn@2'
qi_server = "http://hlm.lge.com/qi"
jira = JIRA(server=qi_server, basic_auth=(ad_id, ad_pw))
 
##time estimate
s_time = time.time()

##JQL Query
jql = 'project = USERREPORT ORDER BY priority DESC, updated DESC'
 
##Issue search parameters
startAt = 1               ##Start index of the search
maxResults = 1000         ##The number of issues to fetch at once
total = 5001              ##Total number of issues to fetch
# total = 500              ##Total number of issues to fetch, if smaller than maxResulst, fetch size is same with maxResult
 
 
 ##make it faster
from multiprocessing import Pool
 
def pre_process_row(row):                
    try:
        issue_key = row.key
    except AttributeError:
        issue_key = None

    try:
        created = datetime.strptime(row.fields.created, '%Y-%m-%dT%H:%M:%S.%f%z')
    except AttributeError:
        created = None

    try:
        mac = row.fields.description[6 : 70]
    except AttributeError:
        mac = None

    try:
        module = row.fields.customfield_20003
    except AttributeError:
        module = None
    
    try:
        model_name_full = row.fields.customfield_16501
        split_model_name_full = model_name_full.split(".")
        model_name = split_model_name_full[0]
    except (AttributeError, IndexError):
        model_name = None

    try:
        platform_soc_year = row.fields.customfield_20002
        split_platform_soc_year = platform_soc_year.split("_")
        year = split_platform_soc_year[0]
        platform = split_platform_soc_year[1]
        soc = split_platform_soc_year[2]
    except (AttributeError ,IndexError):
        year = platform = soc = None

    try:
        version = row.fields.customfield_12701
    except ArithmeticError:
        version = None

    try:
        if 'KR' in row.fields.labels:
            country = 'KR'
        elif 'US' in row.fields.labels:        
            country = 'US'
        elif 'BR' in row.fields.labels:
            country = 'BR'
        else:  
            country = None
    except AttributeError:
        country = None

    try:
        if 'info' in row.fields.labels:
            prosense_type = '사용자리포트'
        elif 'Crash' in row.fields.labels:        
            prosense_type = 'Crash'
        elif 'Fault' in row.fields.labels:
            prosense_type = 'Fault'
        elif 'all' in row.fields.labels:
            prosense_type = '원격상담'    
        else:  
            prosense_type = None
    except AttributeError:
        prosense_type = None

    try:
        if 'store' in row.fields.labels:
            market = 'store'
        elif 'home' in row.fields.labels:        
            market = 'home'  
        else:  
            market = None
    except AttributeError:
        market = None
    
    try:
        status = row.fields.status
    except AttributeError:
        status = None

    try:
        summary = row.fields.summary
    except AttributeError:
        summary = None

    try:
        assignee = row.fields.assignee
    except AttributeError:
        assignee = None

    try:
        reporter = row.fields.reporter
    except AttributeError:
        reporter = None

    try:
        priority = row.fields.priority
    except AttributeError:
        priority = None

    try:
        serial_number = row.fields.customfield_18603
    except AttributeError:
        serial_number = None
            
    return [issue_key, created, mac, module, model_name, platform, soc, version, country, prosense_type, market, status, summary, assignee, reporter, priority, serial_number]

if __name__ == "__main__":
    with Pool() as p:
        while startAt < total :
            result = jira.search_issues(jql, startAt = startAt, maxResults = maxResults)
            
            rows = p.map(pre_process_row,result)
            df_temp = pd.DataFrame(rows, columns=columns)
            df = pd.concat([df, df_temp])
            # for row in rows:
            #     df.loc[len(df)]=row
            startAt += maxResults




##Repeat until all issues are fetched
# while startAt < total:
#     result = jira.search_issues(jql, startAt = startAt, maxResults = maxResults)
 
#     ##Get field values from each row
#     for row in result:                    
#         try:
#             issue_key = row.key
#         except AttributeError:
#             issue_key = None
 
#         try:
#             created = datetime.strptime(row.fields.created, '%Y-%m-%dT%H:%M:%S.%f%z')
#         except AttributeError:
#             created = None
 
#         try:
#             mac = row.fields.description[6 : 70]
#         except AttributeError:
#             mac = None
 
#         try:
#             module = row.fields.customfield_20003
#         except AttributeError:
#             module = None
       
#         try:
#             model_name_full = row.fields.customfield_16501
#             split_model_name_full = model_name_full.split(".")
#             model_name = split_model_name_full[0]
#         except (AttributeError, IndexError):
#             model_name = None
 
#         try:
#             platform_soc_year = row.fields.customfield_20002
#             split_platform_soc_year = platform_soc_year.split("_")
#             year = split_platform_soc_year[0]
#             platform = split_platform_soc_year[1]
#             soc = split_platform_soc_year[2]
#         except (AttributeError ,IndexError):
#             year = platform = soc = None
 
#         try:
#             version = row.fields.customfield_12701
#         except ArithmeticError:
#             version = None
 
#         try:
#             if 'KR' in row.fields.labels:
#                 country = 'KR'
#             elif 'US' in row.fields.labels:        
#                 country = 'US'
#             elif 'BR' in row.fields.labels:
#                 country = 'BR'
#             else:  
#                 country = None
#         except AttributeError:
#             country = None
 
#         try:
#             if 'info' in row.fields.labels:
#                 prosense_type = '사용자리포트'
#             elif 'Crash' in row.fields.labels:        
#                 prosense_type = 'Crash'
#             elif 'Fault' in row.fields.labels:
#                 prosense_type = 'Fault'
#             elif 'all' in row.fields.labels:
#                 prosense_type = '원격상담'    
#             else:  
#                 prosense_type = None
#         except AttributeError:
#             prosense_type = None
 
#         try:
#             if 'store' in row.fields.labels:
#                 market = 'store'
#             elif 'home' in row.fields.labels:        
#                 market = 'home'  
#             else:  
#                 market = None
#         except AttributeError:
#             market = None
       
#         try:
#             status = row.fields.status
#         except AttributeError:
#             status = None
 
#         try:
#             summary = row.fields.summary
#         except AttributeError:
#             summary = None
 
#         try:
#             assignee = row.fields.assignee
#         except AttributeError:
#             assignee = None
 
#         try:
#             reporter = row.fields.reporter
#         except AttributeError:
#             reporter = None
 
#         try:
#             priority = row.fields.priority
#         except AttributeError:
#             priority = None
 
#         try:
#             serial_number = row.fields.customfield_18603
#         except AttributeError:
#             serial_number = None            
       
 
 
#         #df_add = pd.DataFrame(data = [[issue_key, created, mac, module, model_name, platform, soc, version]], columns=columns)
#         #df = pd.concat([df, df_add], ignore_index=True)
#         df.loc[len(df)] = [issue_key, created, mac, module, model_name, platform, soc, version, country, prosense_type, market, status, summary, assignee, reporter, priority, serial_number]
 
#     ##Move to the next page
#     startAt += maxResults
#     #total = result.total
#     print(result.total)
# #print(df)
# # df.to_csv('jira_export.csv', index=False, encoding='utf-8-sig')

##time estimate
time_now=datetime.now().strftime('%Y%m%d_%H%M%S')
f_name=f'data_{time_now}.csv'
df.to_csv(f_name,index=False,encoding='utf-8-sig')
e_time = time.time()

print(f"{e_time-s_time : .5f}s\n")
