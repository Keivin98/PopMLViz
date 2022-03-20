library(GENESIS)
library(SNPRelate)
library(GWASTools)

setwd('/Users/keivinisufaj/Documents/bio-project/Connecting-React-Frontend-to-a-Flask-Backend/backend/data/test_docs')
# showfile.gds(closeall=TRUE)
snpgdsBED2GDS(bed.fn = "CHR22_SUBSET_1KG.bed", bim.fn = "CHR22_SUBSET_1KG.bim", fam.fn ="CHR22_SUBSET_1KG.fam", out.gdsfn = "CHR22_SUBSET_1KG.gds")

geno <- GdsGenotypeReader(filename = "CHR22_SUBSET_1KG.gds")
genoData <- GenotypeData(geno)

kinship <- read.table("KG_KINSHIP.txt", header = FALSE)
IDs <- read.table("CHR22_SUBSET_1KG.fam", header = FALSE)

IDs_col <- IDs[,1]

colnames(kinship) <- IDs_col
rownames(kinship) <- IDs_col

pcair_result       <- pcair(gdsobj = genoData, kinobj = as.matrix(kinship), divobj = as.matrix(kinship), div.thresh= -2^(-9/2),kin.thresh=2^(-9/2), num.cores = 32) ## PC-air

pc_vectors <- as.data.frame(pcair_result$vectors[,c(1:20)])
pc_vectors$IID <- as.character(IDs$V1) 

colnames(pc_vectors)[1:20] = paste("PC",1:20,sep="")
write.csv(pc_vectors, "ALL_PCS1.csv",row.names=F,col.names=TRUE)
