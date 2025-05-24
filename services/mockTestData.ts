
import { TestQuestion } from '../types';

export const mockTestQuestions: TestQuestion[] = [
  {
    id: 'q1',
    text: 'Bạn có thường xuyên cảm thấy khó ngủ hoặc ngủ không ngon giấc không?',
    options: [
      { id: 'q1o1', text: 'Rất thường xuyên' },
      { id: 'q1o2', text: 'Thỉnh thoảng' },
      { id: 'q1o3', text: 'Hiếm khi' },
      { id: 'q1o4', text: 'Không bao giờ' },
    ],
    points: 0, // Points can be assigned based on option selection later
  },
  {
    id: 'q2',
    text: 'Bạn có dễ cảm thấy cáu kỉnh hoặc bực bội với những điều nhỏ nhặt không?',
    options: [
      { id: 'q2o1', text: 'Luôn luôn' },
      { id: 'q2o2', text: 'Thường xuyên' },
      { id: 'q2o3', text: 'Đôi khi' },
      { id: 'q2o4', text: 'Không bao giờ' },
    ],
    points: 0,
  },
  {
    id: 'q3',
    text: 'Bạn có cảm thấy mệt mỏi, thiếu năng lượng ngay cả khi đã nghỉ ngơi đủ không?',
    options: [
      { id: 'q3o1', text: 'Đúng vậy, rất thường xuyên' },
      { id: 'q3o2', text: 'Có, nhưng không thường xuyên lắm' },
      { id: 'q3o3', text: 'Hiếm khi' },
      { id: 'q3o4', text: 'Không, tôi luôn tràn đầy năng lượng' },
    ],
    points: 0,
  },
  {
    id: 'q4',
    text: 'Bạn có gặp khó khăn trong việc tập trung vào công việc hoặc các hoạt động hàng ngày không?',
    options:
    [
      { id: 'q4o1', text: 'Rất khó khăn' },
      { id: 'q4o2', text: 'Thỉnh thoảng gặp khó khăn' },
      { id: 'q4o3', text: 'Ít khi' },
      { id: 'q4o4', text: 'Hoàn toàn không' },
    ],
    points: 0,
  },
  {
    id: 'q5',
    text: 'Bạn có cảm thấy bi quan hoặc mất hứng thú với những điều từng làm bạn vui vẻ không?',
    options: [
      { id: 'q5o1', text: 'Thường xuyên cảm thấy vậy' },
      { id: 'q5o2', text: 'Đôi khi' },
      { id: 'q5o3', text: 'Rất hiếm' },
      { id: 'q5o4', text: 'Không bao giờ' },
    ],
    points: 0,
  }
  // Add up to 30 questions for a full test
];

// Simple scoring logic: assign points to options. Higher points = more stress.
// Example: Option 1 = 3 points, Option 2 = 2, Option 3 = 1, Option 4 = 0.
export const scoreAnswer = (question: TestQuestion, selectedOptionId: string): number => {
  const optionIndex = question.options.findIndex(opt => opt.id === selectedOptionId);
  // Example: 0 (most stressed) to 3 (least stressed) based on index
  // So, most stressed response is option index 0 (e.g., "Rất thường xuyên")
  // We want higher points for more stress, so reverse the index or assign points directly.
  // Let's say option 1 = 3 points, option 2 = 2 points, option 3 = 1 point, option 4 = 0 points
  if (optionIndex === 0) return 3;
  if (optionIndex === 1) return 2;
  if (optionIndex === 2) return 1;
  return 0; // optionIndex === 3 or -1 (not found)
};
