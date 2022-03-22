import subprocess 
import pandas as pd
subprocess.run(["sudo", "Rscript", "PCA_AIR.r"])
print(pd.read_csv('./data/test_docs/ALL_PCS1.csv'))
