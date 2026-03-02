import { Link } from "react-router-dom"

const CourseCard = ({ course }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition duration-300 hover:shadow-xl">
      {/* Image du cours */}
      <div className="relative">
        <img src={course.image || "/placeholder.svg"} alt={course.title} className="w-full h-48 object-cover" />
        {course.featured && (
          <div className="absolute top-3 left-3 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded">
            POPULAIRE
          </div>
        )}
      </div>

      {/* Contenu du cours */}
      <div className="p-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-blue-600 font-medium">{course.category}</span>
          <div className="flex items-center">
            <i className="fas fa-star text-yellow-400 mr-1"></i>
            <span className="text-sm font-medium">{course.rating}</span>
          </div>
        </div>

        <h3 className="text-xl font-semibold mb-2 line-clamp-2">{course.title}</h3>

        <p className="text-gray-600 mb-4 line-clamp-2">{course.description}</p>

        <div className="flex items-center mb-4">
          <img
            src="/placeholder.svg?height=30&width=30"
            alt={course.instructor}
            className="w-8 h-8 rounded-full mr-2"
          />
          <span className="text-sm text-gray-700">Par {course.instructor}</span>
        </div>

        <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
          <span>
            <i className="far fa-clock mr-1"></i> {course.duration}
          </span>
          <span>
            <i className="fas fa-signal mr-1"></i> {course.level}
          </span>
          <span>
            <i className="fas fa-user-graduate mr-1"></i> {course.students.toLocaleString()}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="font-bold text-blue-600">{course.price}</span>
          <Link
            to={`/cours/${course.id}`}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300"
          >
            Voir le cours
          </Link>
        </div>
      </div>
    </div>
  )
}

export default CourseCard
