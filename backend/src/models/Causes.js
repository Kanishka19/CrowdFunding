import mongoose from "mongoose";

const CausesSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  donation_goal: {
    type: Number,
    required: true,
  },
  current_donation_amount: {
    type: Number,
    required: true,
  },
});
const Causes = mongoose.model("Causes", CausesSchema);
export default Causes