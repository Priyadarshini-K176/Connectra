const cron = require("node-cron");
const ConnectionRequest = require("../models/connectionRequest");
const {subDays}=require("date-fns");
const {WeeklyRemainderMailTemplate,}=require("../templates/WeeklyRemainderMailTemplate");
const sendEmail= require("./sendEmail");


//set to send mail At 09:00 on monday

cron.schedule("0 9 * * 1",async()=>{
    try{
        const lastWeekDate = subDays(new Date(),7);
        const pendingRequests=await ConnectionRequest.find({
            status:"interested",
            createdAt:{$gte:lastWeekDate},
        }).populate("fromUserUd toUserId","email name username");

        //Group requests by user
        const userEmailMap = new Map();

        for(const req of pendingRequests){
            const toEmail = req.toUserId.email;
            const toName = req.toUserId.name||"there";
            const toUsername = req.toUserId.username;

            if (!userEmailMap.has(toEmail)) {
                userEmailMap.set(toEmail, {
                    name: toName,
                    username: toUsername,
                    receivedCount: 0,
                    sentCount: 0,
                });
            }

            //count received interest
            userEmailMap.get(toEmail).receivedCount++;

            //count sent interest if fromUser matches
            if (req.fromUserId.email === toEmail) {
                userEmailMap.get(toEmail).sentCount++;
            }
        }

        for(const[email,{name,username,receivedCount,sentCount},] of userEmailMap.entries()){
            const htmlTemplate=WeeklyRemainderMailTemplate(name,username,[
                `${receivedCount} user(s) showed interest in your profile`,
                `${sentCount} of your requests are still pending`,
            ]);

            const subject = "Connectra's Weekly Remaider - See Who's Interested in You!";

            await sendEmail.run(email,subject,htmlTemplate);
        }
        console.log(`✅ Weekly remainder sent to ${userEmailMap.size} users`);


        }catch(err){
            console.error("❌ Weekly cron job failed",err);
        }
    }
);
