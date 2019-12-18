# Problems with large hash tables

## 1st each hash should be created by parsing large XML ~ 200mb so to avoid this in the next itterations of the same operation I write each table to a json file which I read on the next need of use. If the XML is updated the JSONs should be generated again

## Each map takes ~ 70 seconds to be created parsing the xml and writing to the json via streams

## Once the maps are generated I need to read the file, parse it to JS object

### Questions

    * How to optimize
    * Hash tables out of memory?
    * Write only identifiers wich point to the information in the file. Which file? It's XML. 
    * In memo DBs. Which ones? How do they work are they faster? Each time will have to parse the xml again?

Structure the execution
Option to pass property if you want to regenerate maps. For example in cases where the xml files have been updated.
Option to exclude branches from the tree related to compounds and chemicals.
