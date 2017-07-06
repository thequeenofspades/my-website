import json
from pprint import pprint
import re

json_data = open('feats_db_copy.json').read()
data = json.loads(json_data)

allskills = []

for feat in data:
	if len(feat['prerequisite_skills']) > 0:
		skills = re.split(",+",feat['prerequisite_skills'])
		for skill in skills:
			if skill.find("|") < 0 and skill.find("@") < 0:
				rank = 
				skilltext = re.sub(r'\d+', '', skill).strip()
				if skilltext not in allskills:
					allskills.append(skilltext)
	# keyphrase = "base attack bonus";
	# if keyphrase in feat['prerequisites'].lower():
	# 	index = feat['prerequisites'].lower().find(keyphrase) + len(keyphrase) + 4
	# 	if feat['prerequisites'][index:index+3].find("or") < 0:
	# 		feat['minBAB'] = int(re.search(r'\d+', feat['prerequisites'][index-2:index+2]).group())
	# 		print feat['name'], feat['prerequisites'], feat['minBAB']
	# if feat['blood_hex'] == 1:
	# 	categories = re.split(",+|\|+",feat['type'])
	# 	categories.append('Blood Hex')
	# 	print categories
	# 	feat['type'] = ", ".join(categories)
	# 	print feat['type']

allskills.sort()
print allskills


# with open('feats_db_copy.json', 'w') as outfile:
# 	json.dump(data, outfile, indent = 4)