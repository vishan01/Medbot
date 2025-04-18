const express = require("express");
const session = require("express-session");
const { google } = require("googleapis");
const path = require("path");
const crypto = require("crypto");
const cors = require("cors");
require("dotenv").config();

const credentials = require("./creds.json");
const { fitness } = require("googleapis/build/src/apis/fitness");

const { client_secret, client_id, redirect_uris } = credentials.web;
const oAuth2Client = new google.auth.OAuth2(
  client_id,
  client_secret,
  redirect_uris[0]
);

const SCOPES = [
  "https://www.googleapis.com/auth/fitness.activity.read",
  "https://www.googleapis.com/auth/fitness.blood_glucose.read",
  "https://www.googleapis.com/auth/fitness.blood_pressure.read",
  "https://www.googleapis.com/auth/fitness.heart_rate.read",
  "https://www.googleapis.com/auth/fitness.body.read",
  "https://www.googleapis.com/auth/fitness.body.read",
  "https://www.googleapis.com/auth/fitness.sleep.read",
  "https://www.googleapis.com/auth/fitness.body.read",
  "https://www.googleapis.com/auth/fitness.reproductive_health.read",
  "https://www.googleapis.com/auth/userinfo.profile",
];
const secretKey = crypto.randomBytes(32).toString("hex");

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173", // Replace with the actual origin of your React app
  })
);

app.use(
  session({
    secret: secretKey,
    resave: false,
    saveUninitialized: true,
  })
);

let userProfileData;
async function getUserProfile(auth) {
  const service = google.people({ version: "v1", auth });
  const profile = await service.people.get({
    resourceName: "people/me",
    personFields: "names,photos,emailAddresses",
  });

  const displayName = profile.data.names[0].displayName;
  const url = profile.data.photos[0].url;
  let userID = profile.data.resourceName;
  userID = parseInt(userID.replace("people/", ""), 10);
  return {
    displayName,
    profilePhotoUrl: url,
    userID,
  };
}

app.get("/auth/google", (req, res) => {
  console.log("hittttt!!!!");

  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
  });
  res.json({ authUrl });
  //res.redirect(authUrl);
});

app.get("/auth/google/callback", async (req, res) => {
  const { code } = req.query;

  try {
    const { tokens } = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);
    req.session.tokens = tokens;

    const profile = await getUserProfile(oAuth2Client);
    // Save user profile data in the session

    req.session.userProfile = profile;
    userProfileData = profile;
    res.redirect("http://localhost:5173/user");

    // res.redirect("/fetch-data");
  } catch (error) {
    console.error("Error retrieving access token:", error);
    res.redirect("/error");
  }
});
let isSecondHit = false;
app.get("/fetch-data", async (req, res) => {
  try {
    const fitness = google.fitness({
      version: "v1",
      auth: oAuth2Client,
    });

    //  const userProfile = req.session.userProfile;

    // Access user's name, profile photo, and ID
    const userName = userProfileData.displayName;
    const profilePhoto = userProfileData.profilePhotoUrl;
    const userId = userProfileData.userID;

    const sevenDaysInMillis = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
    const startTimeMillis = Date.now() - sevenDaysInMillis; // Start time is 7 days ago
    const endTimeMillis = Date.now() + 24 * 60 * 60 * 1000; // End time is the current time

    const response = await fitness.users.dataset.aggregate({
      userId: "me",
      requestBody: {
        aggregateBy: [
          {
            dataTypeName: "com.google.step_count.delta",
          },
          {
            dataTypeName: "com.google.blood_glucose",
          },
          {
            dataTypeName: "com.google.blood_pressure",
          },
          {
            dataTypeName: "com.google.heart_rate.bpm",
          },
          {
            dataTypeName: "com.google.weight",
          },
          {
            dataTypeName: "com.google.height",
          },
          {
            dataTypeName: "com.google.sleep.segment",
          },
          {
            dataTypeName: "com.google.body.fat.percentage",
          },
          {
            dataTypeName: "com.google.calories.expended",
          },
          {
            dataTypeName: "com.google.heart_minutes",
          },
          
        ],
        bucketByTime: { durationMillis: 86400000 }, // Aggregate data in daily buckets
        startTimeMillis,
        endTimeMillis,
      },
    });

    const fitnessData = response.data.bucket;
    const formattedData = [];

    fitnessData.map((data) => {
      const date = new Date(parseInt(data.startTimeMillis));
      const formattedDate = date.toDateString();

      //console.log("Date:", formattedDate);
      const formattedEntry = {
        date: formattedDate,
        step_count: 0,
        glucose_level: 0,
        blood_pressure: [],
        // low_blood_pressure: 0,
        heart_rate: 0,
        weight: 0,
        height_in_cms: 0,
        sleep_hours: 0,
        body_fat_in_percent: 0,
        heart_points: 0,
        calories: 0,
      };
      const datasetMap = data.dataset;
      datasetMap.map((mydataset) => {
        const point = mydataset.point;
        // console.log(mydataset.dataSourceId)
        if (point && point.length > 0) {
          const value = point[0].value;
          switch (mydataset.dataSourceId) {
            case "derived:com.google.step_count.delta:com.google.android.gms:aggregated":
              // console.log("Step count:", value[0]?.intVal);
              formattedEntry.step_count = value[0]?.intVal || 0;
              break;
            case "derived:com.google.blood_glucose.summary:com.google.android.gms:aggregated":
              // console.log("Blood glucose:",mydataset.point[0]?.value)
              let glucoseLevel = 0;
              if (mydataset.point[0]?.value) {
                if (mydataset.point[0]?.value.length > 0) {
                  const dataArray = mydataset.point[0]?.value;
                  dataArray.map((data) => {
                    if (data.fpVal) {
                      glucoseLevel = data.fpVal * 10;
                    }
                  });
                }
              }
              formattedEntry.glucose_level = glucoseLevel;
              break;
            case "derived:com.google.blood_pressure.summary:com.google.android.gms:aggregated":
              // console.log("Blood pressure:",mydataset.point[0]?.value)
              let finalData = [0, 0];
              if (mydataset.point[0]?.value) {
                const BParray = mydataset.point[0]?.value;
                if (BParray.length > 0) {
                  BParray.map((data) => {
                    if (data.fpVal) {
                      if (data.fpVal > 100) {
                        finalData[0] = data.fpVal;
                      } else if (data.fpVal < 100) {
                        finalData[1] = data.fpVal;
                      }
                    }
                  });
                }
              }
              formattedEntry.blood_pressure = finalData;
              break;
            case "derived:com.google.heart_rate.summary:com.google.android.gms:aggregated":
              // console.log("Heart rate:",mydataset.point[0]?.value)
              let heartData = 0;
              if (mydataset.point[0]?.value) {
                if (mydataset.point[0]?.value.length > 0) {
                  const heartArray = mydataset.point[0]?.value;
                  heartArray.map((data) => {
                    if (data.fpVal) {
                      heartData = data.fpVal;
                    }
                  });
                }
              }
              formattedEntry.heart_rate = heartData;
              break;
            case "derived:com.google.weight.summary:com.google.android.gms:aggregated":
              // console.log("Weight:",value[0]?.fpVal)
              formattedEntry.weight = value[0]?.fpVal || 0;
              break;
            case "derived:com.google.height.summary:com.google.android.gms:aggregated":
              // console.log("Height:",value[0]?.fpVal)
              formattedEntry.height_in_cms = value[0]?.fpVal * 100 || 0;
              break;
            case "derived:com.google.sleep.segment:com.google.android.gms:merged":
              // console.log("Sleep:",mydataset.point[0]?.value)
              formattedEntry.sleep_hours = mydataset.point[0]?.value || 0;
              break;
            case "derived:com.google.body.fat.percentage.summary:com.google.android.gms:aggregated":
              // console.log("Body Fat:",mydataset.point[0]?.value)
              let bodyFat = 0;
              if (mydataset.point[0]?.value) {
                if (mydataset.point[0]?.value.length > 0) {
                  bodyFat = mydataset.point[0].value[0].fpVal;
                }
              }
              formattedEntry.body_fat_in_percent = bodyFat;
              break;
            case "derived:com.google.heart_minutes.summary:com.google.android.gms:aggregated":
                console.log("Heart Points:",mydataset.point[0]?.value)
                formattedEntry.heart_points =
                  mydataset.point[0]?.value[0]?.fpVal || 0;
                break;
              case "derived:com.google.calories.expended:com.google.android.gms:aggregated":
                  // console.log("Menstrual:",mydataset.point[0]?.value)
                  formattedEntry.calories =
                    mydataset.point[0]?.value[0]?.fpVal || 0;
                  break;
            default:
              break;
          }
        }
        // else {
        //    console.log(`No data available`);
        //   }
      });
      formattedData.push(formattedEntry);

      // console.log("-----------------------")
      // console.log(datasetMap[0].point[0]?.value)
    });
    console.log("Fitness data fetched successfully!");
    isSecondHit = true;
    res.send({
      userName,
      profilePhoto,
      userId,
      formattedData, // Include your fitness data here
    });
  } catch (error) {
    console.error("Error fetching fitness data:", error);
    res.redirect("/error");
  }
});

app.listen(8000, () => {
  console.log("service listening at 8000");
});