import StudentProgress from "../models/StudentProgress.js";
import Course from "../models/Course.js";
import Lesson from "../models/Lesson.js";

export const updateStudentProgress = async (
  userId,
  quizId,
  isPassed,
  attemptNumber
) => {
  let lesson;
  let studentProgress;
  let quizFinale = false;
  let course = await Course.findOne({ quizFinal: quizId });
  if (course) {
    quizFinale = true;
    console.log("QUiz Final");
    studentProgress = await StudentProgress.findOne({
      student: userId,
      course: course._id,
    });
  } else {
    lesson = await Lesson.findOne({ quiz: quizId });
    if (!lesson) {
      throw new Error("Lesson not found with the provided quiz ID.");
    }
    course = await Course.findOne({ lessons: { $in: [lesson._id] } });
    studentProgress = await StudentProgress.findOne({
      student: userId,
      course: course._id,
    });
  }

  console.log("Get Final : ", quizFinale);

  if (!studentProgress) {
    await StudentProgress.create({
      student,
      course: course._id,
      lesson: isPassed ? 2 : 1,
      completionStatus: isPassed
        ? "completed"
        : attemptNumber > 1
        ? "failed"
        : "in-progress",
    });
  } else {
    if (lesson) {
      console.log("QUiz Final : ", quizFinale);
      if (!isPassed && attemptNumber > 1) {
        studentProgress.completionStatus = "failed";
        await studentProgress.save();
        return;
      }

      if (isPassed && !quizFinale) {
        studentProgress.completionStatus = "in-progress";
        studentProgress.lesson = lesson.order + 1;
        await studentProgress.save();
        return;
      }
    } else {
      if (quizFinale && isPassed) {
        studentProgress.completionStatus = "completed";
        await studentProgress.save();
        return;
      }
    }
  }
};
