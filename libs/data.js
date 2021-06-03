/**
 * Title: Data store locale file system
 * Description: Using file system working with database system store
 * Author: Jagadish Chakma
 * Date: 30-05-2021
 * Version: 0.1
 */

// dependencies
const fs = require('fs');
const path = require('path');

// module scaffolding 
const lib = {};

// base directory of the data uri
const pathParsed = path.parse(__dirname);
const rootPath = pathParsed.dir;
lib.baseDir = rootPath+'/data';

// create database file
lib.createFile = (dir, file, data, callBack) => {
    // open file for writing
    fs.open(lib.baseDir+'/' + dir + '/'+file+'.json', 'wx', (err, fileDescriptor) => {
        if(!err && fileDescriptor){
            // convert data to string
            const stringData = JSON.stringify(data);
            // write data to file and close it
            fs.writeFile(fileDescriptor, stringData, (err2) => {
                if(!err2){
                    fs.close(fileDescriptor, (err3) => {
                        if(!err3){
                            callBack(false);
                        }else{
                            callBack('Error closing the new file');
                        }
                    })
                }else{
                    callBack('Error writing to new file');
                }
            })
        }else{
            callBack('could not create new file. it may already exists');
        }
    });
};

// read database file
lib.readFile = (dir, file, callBack) => {
    fs.readFile(lib.baseDir+'/' + dir + '/'+file+'.json', (err, result) => {
        if(!err && result){
            callBack(false, JSON.parse(result));
        }else{
            callBack(true, null);
        }
    });
};

// update database file
lib.updateFile = (dir, file, data, callBack) => {
    // open file for updating
    fs.open(lib.baseDir+'/' + dir + '/'+file+'.json', 'r+', (err, fileDescriptor) => {
        if(!err && fileDescriptor){
            // convert data to string
            const stringData = JSON.stringify(data);

            // truncate the file
            fs.truncate(fileDescriptor, (err2) => {
                if(!err2){
                    // write file
                    fs.writeFile(fileDescriptor, stringData, (err3) => {
                        if(!err3){
                            fs.close(fileDescriptor, (err4) => {
                                if(!err4){
                                    callBack(false);
                                }else{
                                    callBack('Failed to close file and write');
                                }
                            })
                        }else{
                            callBack('Failed to write file');
                        }
                    });
                }else{
                    callBack('Failed to truncate file');
                }
            });
        }else{
            callBack('error updating file, may not exists');
        }
    });
};

// delete database file
lib.deleteFile = (dir, file, callBack) => {
    const fileExists = fs.existsSync(lib.baseDir+'/' + dir + '/'+file+'.json');
    if(fileExists){
        fs.unlink(lib.baseDir+'/' + dir + '/'+file+'.json', (err) => {
            if(!err){
                callBack(false, {message: 'File delete success'});
            }else{
                callBack(true, {error: 'File is unable to delete'});
            }
        });
    }else{
        callBack(true, {error: 'File is not found'});
    }
}
// module exporting
module.exports = lib;