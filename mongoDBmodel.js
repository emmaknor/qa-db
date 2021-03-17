{
  // _id property added by default by mongoose
  product_id: Number,
  questions: [
    question_id: Number,
    question_body: String,
    question_date: Date,
    asker_name: String,
    asker_email: String,
    question_helpfulness: Number,
    reported: Boolean,
    answers: [
      {
        answer_id: Number,
        answerer_name: String,
        answerer_email: String,
        answer_body: String,
        answer_date: Date,
        answer_helpfulness: Number,
        answer_reported: Boolean,
        photos: [
          photo_id: Number,
          url: String
        ]
      }
    ]
  ]
};
