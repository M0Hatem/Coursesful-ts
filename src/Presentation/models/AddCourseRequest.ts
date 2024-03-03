export default class AddCourseRequest {
  constructor(
    public name: string,
    public maxStudents: number,
    public price: number
  ) {}
}
