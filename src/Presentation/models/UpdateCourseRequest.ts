export default class UpdateCourseRequest {
  constructor(
    public name?: string,
    public maxStudents?: number,
    public price?: number
  ) {}
}
