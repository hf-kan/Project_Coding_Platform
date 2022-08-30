import static org.junit.jupiter.api.Assertions.*;
import org.junit.jupiter.api.*;

class Tester {

    @Test
    @DisplayName("Input = 0")
    void test1() {
        Solution solution = new Solution();
        Submission submission = new Submission();
        int input = 0;
        assertArrayEquals(solution.loop(input), submission.loop(input), "Expected Result: []");
    }

    @Test
    @DisplayName("Input = 1")
    void test2() {
        Solution solution = new Solution();
        Submission submission = new Submission();
        int input = 1;
        assertArrayEquals(solution.loop(input), submission.loop(input), "Expected Result: [0]");
    }

    @Test
    @DisplayName("Input = 3")
    void test3() {
        Solution solution = new Solution();
        Submission submission = new Submission();
        int input = 3;
        assertArrayEquals(solution.loop(input), submission.loop(input), "Expected Result: [0,1,2]");
    }

    @Test
    @DisplayName("Input = 5")
    void test4() {
        Solution solution = new Solution();
        Submission submission = new Submission();
        int input = 5;
        assertArrayEquals(solution.loop(input), submission.loop(input), "Expected Result: [0,1,2,3,4]");
    }

    @Test
    @DisplayName("Input = 6")
    void test5() {
        Solution solution = new Solution();
        Submission submission = new Submission();
        int input = 6;
        assertArrayEquals(solution.loop(input), submission.loop(input), "Expected Result: [0,1,2,3,4,5]");
    }

    @Test
    @DisplayName("Input = 8")
    void test6() {
        Solution solution = new Solution();
        Submission submission = new Submission();
        int input = 8;
        assertArrayEquals(solution.loop(input), submission.loop(input), "Expected Result: [0,1,2,3,4,5,6,7]");
    }
}
