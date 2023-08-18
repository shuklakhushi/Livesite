import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import mongoose from 'mongoose';

import User from '../Models/user';

import Songs from '../Models/songs';

import { GenerateToken } from '../Util/index';
;

// Utility Function
function SanitizeArray(unsanitizedValue: string | string[]): string[] 
{
    if (Array.isArray(unsanitizedValue)) 
    {
        return unsanitizedValue.map((value) => value.trim());
    } else if (typeof unsanitizedValue === "string") 
    {
        return unsanitizedValue.split(",").map((value) => value.trim());
    } else {
        return [];
    }
}

/* Authentication Functions */

export function ProcessRegistration(req:Request, res:Response, next:NextFunction): void
{
    // instantiate a new user object
    let newUser = new User
    ({
        username: req.body.username,
        emailAddress: req.body.EmailAddress,
        displayName: req.body.FirstName + " " + req.body.LastName 
    });

    User.register(newUser, req.body.password, (err) => 
    {
        if(err instanceof mongoose.Error.ValidationError)
        {
            console.error('All Fields Are Required');
            return res.json({success: false, msg: 'ERROR: User Not Registered. All Fields Are Required'});
        }


        if(err){
            console.error('Error: Inserting New User');
            if(err.name == "UserExistsError")
            {
               console.error('Error: User Already Exists');
            }
            return res.json({success: false, msg: 'User not Registered Successfully!'});
        }
        // if we had a front-end (Angular, React or a Mobile UI)...
        return res.json({success: true, msg: 'User Registered Successfully!'});
    });
}

export function ProcessLogin(req:Request, res:Response, next:NextFunction): void
{
    passport.authenticate('local', (err:any, user:any, info:any) => {
        // are there server errors?
        if(err)
        {
            console.error(err);
            return next(err);
        }

        // are the login errors?
        if(!user)
        {
			return res.json({success: false, msg: 'ERROR: User Not Logged in.'});
        }

        req.logIn(user, (err) =>
        {
            // are there db errors?
            if(err)
            {
                console.error(err);
                res.end(err);
            }

            const authToken = GenerateToken(user);

            return res.json({success: true, msg: 'User Logged In Successfully!', user: {
                id: user._id,
                displayName: user.displayName,
                username: user.username,
                emailAddress: user.emailAddress
            }, token: authToken});
        });
        return;
    })(req, res, next);
}

export function ProcessLogout(req:Request, res:Response, next:NextFunction): void
{
    req.logout(() =>{
        console.log("User Logged Out");
    });
    
    // if we had a front-end (Angular, React or Mobile UI)...
    res.json({success: true, msg: 'User Logged out Successfully!'});

}


/* API Functions */
export function DisplaySongsList(req: Request, res: Response, next: NextFunction): void
{
    Songs.find({})
    .then(function(data)
    {
        res.status(200).json({success: true, msg: "Song List Displayed Successfully", data: data});
    })
    .catch(function(err)
    {
        console.error(err);
        res.status(500).json({success: false, msg: "ERROR: Something Went Wrong", data: null});
    });
}

export function DisplaySongsByID(req: Request, res: Response, next: NextFunction): void
{
    try
    {
        let id = req.params.id;
        Songs.findById({_id: id})
        .then(function(data)
        {
            if(data)
            {
                res.status(200).json({success: true, msg: "Songs Retrieved by ID Successfully", data: data});
            }
            else
            {
                res.status(404).json({success: false, msg: "Songs ID Not Found", data: data});
            }
            
        })
        .catch(function(err)
        {
            console.error(err);
            res.status(400).json({success: false, msg: "ERROR: Songs ID not formatted correctly", data: null});
        });
    }
    catch(err)
    {
        console.error(err);
        res.status(500).json({success: false, msg: "ERROR: Something Went Wrong", data: null});
    }
}

export function AddSongs(req: Request, res: Response, next: NextFunction): void
{
    try
    {
        
        
        let songs = new Songs({
           songID: req.body.songID,
           title: req.body.title,
           artist: req.body.artist,
           album: req.body.album,
           genre: req.body.genre,
           duration: req.body.duration,
           releaseDate: req.body.releaseDate,
           label: req.body.label,
           trackNumber: req.body.trackNumber,
           rating: req.body.rating,
           composer: req.body.composer,
           youtubeLink: req.body.youtubeLink
           
        });
    
        Songs.create(songs)
        .then(function()
        {
            res.status(200).json({success: true, msg: "Song Added Successfully", data:songs});
        })
        .catch(function(err)
        {
            console.error(err);
            if(err instanceof mongoose.Error.ValidationError)
            {
                res.status(400).json({success: false, msg: "ERROR: Song Not Added. All Fields are required", data:null});
            }
            else
            {
                res.status(400).json({success: false, msg: "ERROR: Song Not Added.", data:null});
            }
        });
    }
    catch(err)
    {
        console.error(err);
        res.status(500).json({success: false, msg: "Something Went Wrong", data: null});
    }
}

export function UpdateSongs(req: Request, res: Response, next: NextFunction): void
{
    try
    {
        let id = req.params.id;
    
    
        let songsToUpdate = new Songs({
           _id: id,
           songID: req.body.songID,
           title: req.body.title,
           artist: req.body.artist,
           album: req.body.album,
           genre: req.body.genre,
           duration: req.body.duration,
           releaseDate: req.body.releaseDate,
           label: req.body.label,
           trackNumber: req.body.trackNumber,
           rating: req.body.rating,
           composer: req.body.composer,
           youtubeLink: req.body.youtubeLink
        });
    
        Songs.updateOne({_id: id}, songsToUpdate)
        .then(function()
        {
            res.status(200).json({success: true, msg: "Song Updated Successfully", data:songsToUpdate});
        })
        .catch(function(err)
        {
            console.error(err);
            if(err instanceof mongoose.Error.ValidationError)
            {
                res.status(400).json({success: false, msg: "ERROR: Song Not Updated. All Fields are required", data:null});
            }
            else
            {
                res.status(400).json({success: false, msg: "ERROR: Song Not Updated.", data:null});
            }
        });
    }
    catch(err)
    {
        console.error(err);
        res.status(500).json({success: false, msg: "Something Went Wrong", data: null});
    }
}

export function DeleteSongs(req: Request, res: Response, next: NextFunction): void
{
    try
    {
        let id = req.params.id;

        Songs.deleteOne({_id: id})
        .then(function()
        {
            res.status(200).json({success: true, msg: "Song Deleted Successfully", data:id});
        })
        .catch(function(err)
        {
            console.error(err);
            res.status(400).json({success: false, msg: "ERROR: Song ID not formatted correctly", data: null});
        });
    }
    catch(err)
    {
        console.error(err);
        res.status(500).json({success: false, msg: "ERROR: Something Went Wrong", data: null});
    }
}