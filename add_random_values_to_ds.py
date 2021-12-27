import random 
with open('/Users/keivinisufaj/Documents/bio-project/Connecting-React-Frontend-to-a-Flask-Backend/frontend/public/datasets/pheno_for_MElS.csv') as f:
	with open('/Users/keivinisufaj/Documents/bio-project/Connecting-React-Frontend-to-a-Flask-Backend/frontend/public/datasets/pheno_for_MElS_2.csv', 'w') as g:
		i = 0
		for line in f:
			line1 = line.rstrip('\n')
			
			if not i:
				g.write('%s,%s\n' %(line1, 'gender'))
			else:
				line1 = ",".join([line1.split(',')[0]] + line1.split(',')[2:] )
				g.write('%s\n' % (line1))
			i += 1 
			
