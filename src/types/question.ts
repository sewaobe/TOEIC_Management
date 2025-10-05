export interface Question {
  id: string;
  textQuestion: string;
  correctAnswer: string;
  explanation: string;
  tags: string[];
  planned_time: number;
  created_at: string;
  group_id: string;
  group_part: number;
  group_type: string;
}