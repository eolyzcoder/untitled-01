import Twilio from 'twilio';
import dotenv from 'dotenv';

dotenv.config();

const twilioSID = process.env.TWILIO_ACCSID;
const twilioToken = process.env.TWILIOAUTHTOKEN;
const serviceId = process.env.TWILIOSMSSERVICEID;

const client = new Twilio(twilioSID, twilioToken);

export const sendOtp = async (params) => {
    return await client.verify.services(serviceId).verifications.create(params);
};

export const verifyOTP = async (params) => {
    const { to, code } = params;
    return await client.verify.services(serviceId).verificationChecks.create({to:to , code:code});
}

