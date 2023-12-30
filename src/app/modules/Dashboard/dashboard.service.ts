import { Admin } from '../Admin/admin.model';
import EnrolledCourse from '../EnrolledCourse/enrolledCourse.model';
import { Faculty } from '../Faculty/faculty.model';
import { AcademicDepartment } from '../academicDepartment/academicDepartment.model';
import { AcademicFaculty } from '../academicFaculty/academicFaculty.model';
import { SemesterRegistration } from '../semesterRegistration/semesterRegistration.model';
import { Student } from '../student/student.model';

const totalAnalytics = async () => {
  const totalStudents = await Student.countDocuments();
  const totalAdmins = await Admin.countDocuments();
  const totalFaculties = await Faculty.countDocuments();
  const totalAcademicFaculties = await AcademicFaculty.countDocuments();
  const totalDepartments = await AcademicDepartment.countDocuments();
  const totalSemesterEnds = await SemesterRegistration.find({
    status: 'ENDED',
  }).countDocuments();

  return {
    totalStudents,
    totalAdmins,
    totalFaculties,
    totalAcademicFaculties,
    totalDepartments,
    totalSemesterEnds,
  };
};

const totalStudentAnalytics = async () => {
  const studentAnalytics = await Student.aggregate([
    {
      $facet: {
        admissionSemesterWise: [
          {
            $lookup: {
              from: 'academicsemesters',
              localField: 'admissionSemester',
              foreignField: '_id',
              as: 'admissionSemester',
            },
          },
          {
            $unwind: '$admissionSemester',
          },

          {
            $group: {
              _id: '$admissionSemester',
              totalStudents: { $push: '$_id' },
            },
          },
          {
            $project: {
              _id: 0,
              admissionSemester: {
                _id: '$_id._id',
                name: '$_id.name',
                year: '$_id.year',
              },
              totalStudents: { $size: '$totalStudents' },
            },
          },
        ],
        academicDepartmentWise: [
          {
            $lookup: {
              from: 'academicdepartments',
              localField: 'academicDepartment',
              foreignField: '_id',
              as: 'academicDepartment',
            },
          },
          {
            $unwind: '$academicDepartment',
          },

          {
            $group: {
              _id: '$academicDepartment',
              totalStudents: { $push: '$_id' },
            },
          },
          {
            $project: {
              _id: 0,
              academicDepartment: {
                _id: '$_id._id',
                name: '$_id.name',
              },
              totalStudents: { $size: '$totalStudents' },
            },
          },
        ],
        academicFacultyWise: [
          {
            $lookup: {
              from: 'academicdepartments',
              localField: 'academicDepartment',
              foreignField: '_id',
              as: 'academicDepartment',
            },
          },
          {
            $unwind: '$academicDepartment',
          },
          {
            $lookup: {
              from: 'academicfaculties',
              localField: 'academicDepartment.academicFaculty',
              foreignField: '_id',
              as: 'academicFaculty',
            },
          },
          {
            $unwind: '$academicFaculty',
          },
          {
            $group: {
              _id: '$academicFaculty',
              totalStudents: { $push: '$_id' },
            },
          },
          {
            $project: {
              _id: 0,
              academicFaculty: {
                _id: '$_id._id',
                name: '$_id.name',
              },
              totalStudents: { $size: '$totalStudents' },
            },
          },
        ],
      },
    },
  ]);

  return studentAnalytics;
};

const enrolledSemesterAnalytics = async () => {
  const studentAnalytics = await EnrolledCourse.aggregate([
    {
      $lookup: {
        localField: 'academicSemester',
        foreignField: '_id',
        from: 'academicsemesters',
        as: 'academicSemester',
      },
    },
    {
      $unwind: '$academicSemester',
    },
    {
      $group: {
        _id: '$academicSemester',
        students: { $push: '$student' },
      },
    },

    {
      $project: {
        _id: 0,
        academicSemester: {
          _id: '$_id._id',
          name: '$_id.name',
          year: '$_id.year',
        },
        students: { $size: '$students' },
      },
    },
  ]);

  return { studentAnalytics };
};

const totalFacultyAnalytics = async () => {
  const facultyAnalytics = await Faculty.aggregate([
    {
      $facet: {
        academicDepartmentWise: [
          {
            $lookup: {
              from: 'academicdepartments',
              localField: 'academicDepartment',
              foreignField: '_id',
              as: 'academicDepartment',
            },
          },
          {
            $unwind: '$academicDepartment',
          },
          {
            $group: {
              _id: '$academicDepartment',
              totalFaculties: { $push: '$_id' },
            },
          },
          {
            $project: {
              _id: 0,
              academicDepartment: {
                _id: '$_id._id',
                name: '$_id.name',
              },
              totalFaculties: { $size: '$totalFaculties' },
            },
          },
        ],
        academicFacultyWise: [
          {
            $lookup: {
              from: 'academicdepartments',
              localField: 'academicDepartment',
              foreignField: '_id',
              as: 'academicDepartment',
            },
          },
          {
            $unwind: '$academicDepartment',
          },
          {
            $lookup: {
              from: 'academicfaculties',
              localField: 'academicDepartment.academicFaculty',
              foreignField: '_id',
              as: 'academicFaculty',
            },
          },
          {
            $unwind: '$academicFaculty',
          },
          {
            $group: {
              _id: '$academicFaculty',
              totalFaculties: { $push: '$_id' },
            },
          },
          {
            $project: {
              _id: 0,
              academicFaculty: {
                _id: '$_id._id',
                name: '$_id.name',
              },
              totalFaculties: { $size: '$totalFaculties' },
            },
          },
        ],
        enrolledCourseWise: [
          {
            $lookup: {
              from: 'enrolledcourses',
              localField: '_id',
              foreignField: 'faculty',
              as: 'enrolledCourses',
            },
          },
          {
            $unwind: '$enrolledCourses',
          },
          {
            $group: {
              _id: '$enrolledCourses.course',
              course: { $first: '$enrolledCourses.course' },
              totalFaculties: { $push: '$_id' },
            },
          },
          {
            $lookup: {
              from: 'courses',
              localField: 'course',
              foreignField: '_id',
              as: 'course',
            },
          },
          {
            $unwind: '$course',
          },
          {
            $project: {
              _id: 0,
              course: {
                _id: '$course._id',
                name: '$course.title',
                prefix: '$course.prefix',
                code: '$course.code',
              },
              totalFaculties: { $size: '$totalFaculties' },
            },
          },
        ],
      },
    },
  ]);

  return facultyAnalytics;
};

export const DashboardServices = {
  enrolledSemesterAnalytics,
  totalStudentAnalytics,
  totalAnalytics,
  totalFacultyAnalytics,
};
