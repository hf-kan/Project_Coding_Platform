import static org.junit.jupiter.api.Assertions.*;
import org.junit.jupiter.api.*;

import java.util.concurrent.TimeUnit;

class Tester {

    @Test
    @DisplayName("Input: 0 Expected output: []")
    @Timeout(value = 1, unit = TimeUnit.SECONDS)
    void test1() {
        Solution solution = new Solution();
        Submission submission = new Submission();
        int input = 0;
        assertArrayEquals(solution.loop(input), submission.loop(input));
    }

    @Test
    @DisplayName("Input: 1 Expected output: [0]")
    @Timeout(value = 1, unit = TimeUnit.SECONDS)
    void test2() {
        Solution solution = new Solution();
        Submission submission = new Submission();
        int input = 1;
        assertArrayEquals(solution.loop(input), submission.loop(input));
    }

    @Test
    @DisplayName("Input: 3 Expected output: [0,1,2]")
    @Timeout(value = 1, unit = TimeUnit.SECONDS)
    void test3() {
        Solution solution = new Solution();
        Submission submission = new Submission();
        int input = 3;
        assertArrayEquals(solution.loop(input), submission.loop(input));
    }

    @Test
    @DisplayName("Input: 5 Expected output: [0,1,2,3,4]")
    @Timeout(value = 1, unit = TimeUnit.SECONDS)
    void test4() {
        Solution solution = new Solution();
        Submission submission = new Submission();
        int input = 5;
        assertArrayEquals(solution.loop(input), submission.loop(input));
    }

    @Test
    @DisplayName("Input: 6 Expected output: [0,1,2,3,4,5]")
    @Timeout(value = 1, unit = TimeUnit.SECONDS)
    void test5() {
        Solution solution = new Solution();
        Submission submission = new Submission();
        int input = 6;
        assertArrayEquals(solution.loop(input), submission.loop(input));
    }

    @Test
    @DisplayName("Input: 8 Expected output: [0,1,2,3,4,5,6,7]")
    void test6() {
        Solution solution = new Solution();
        Submission submission = new Submission();
        int input = 8;
        assertArrayEquals(solution.loop(input), submission.loop(input));
    }
}
