if (!require("BiocManager", quietly = TRUE))
    install.packages("BiocManager")

BiocManager::install(c("GENESIS", "SNPRelate", "GWASTools"), ask=F)
