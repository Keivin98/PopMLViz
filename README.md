# PopMLVIs

PopMLvis is a population genetic analysis application. It provides a comprehensive interactive environment for scientists, bioinformaticians, and researchers to dig deeper in analyzing population genetic datasets. In order to understand the gene structure, our platform analysis includes dimensionality reduction algorithms, machine learning models, statistical measurements and more.

## Getting Started

These instructions will cover usage information for the docker container.

## Prerequisities

In order to run this container you'll need docker installed.

- [Windows](https://docs.docker.com/windows/started)
- [OS X](https://docs.docker.com/mac/started/)
- [Linux](https://docs.docker.com/linux/started/)

If cloning the repository, install git-lfs. (https://github.com/git-lfs/git-lfs/blob/main/README.md)

## Usage

Download the source code by either cloning the repository (`git clone https://github.com/qcri/QCAI-PopMLVis.git`) or Download Zip as following.

![1](https://github.com/Keivin98/PopMLViz/blob/main/4.png?raw=true)

There are two configuration files, backend/gunicorn_local.conf, and frontend/envfile. Modify them only if you want to change the configuration of the backend or frontend.

After that, run

```shell
docker-compose up
```

After the initialization is done, open your web-browser and load http://localhost:3000

## Documentation

The documentation and funcionality is reported at https://popmlvis.qcri.org/static/media/PopMLvis.b6275acf.pdf

## INSTRUCTIONS FOR THE INPUT DATA:

### UPLOAD AND VISUALIZE

    - PCA
        ○ It accepts both comma separated and space separated files.
        ○ The input should have headers.
        ○ Each PCA column needs to be named PC*(or TSNE*, but not both!)
        where * can be any string of alphanumeric values.
        ○ The rest of the columns also need to be named, but the naming
          need not be specific.
        ○ Make sure to have a column named IID, in order for the "Merge Metadata"
          functionality to correctly map the subjects.

    - PCA and Admixture
        ○ The PCA input file should have the above structure.
        ○ It accepts files with .Q extension
        ○ The content of the .Q file:
            ○ Should not have headers.
            ○ Should be space delimited.
        ○ NOTE : For the correct visualization of the Scatter Plot with the admix
          clustering information, the ordering of the data should be the same in the
          PCA and Admix input.

### DIMENSIONALITY REDUCTION

    - PCA
        ○ It accepts a correlation matrix.
        ○ The input can be a comma separated, space delimited or a pickle file
          containing the correlation matrix.
        ○ The input need not have headers or indices.
    - PC-AiR
        ○ It accepts .bed, .bim, .fam files.
        ○ The kinship can be comma or space delimited.
        ○ If we detect that the files do not have a similar structure
          (ex. Same number of subjects etc.), an error will be thrown.
    - t-SNE 2D/3D
        ○ It will work with both PCA/PC-AiR data or Correlation Matrix data.
        ○ If the number of columns is relatively large (eg. > 50), make sure
          to use another dimensionality reduction method first.

### ADD METADATA

    - The input file should consist of headers.
    - It can be comma or space delimited.
    - It should have a column called IID that stores the ids of the subjects.
    - NOTE: If the number of subjects in the metadata do not match that of the initial
      file input, then an error screen will appear. However, the matching will still be
      done based on the IIDs that appear in both the input file and the metadata file.

## RESULT

![2](https://github.com/Keivin98/PopMLViz/blob/main/2.png?raw=true)
![3](https://github.com/Keivin98/PopMLViz/blob/main/3.png?raw=true)
