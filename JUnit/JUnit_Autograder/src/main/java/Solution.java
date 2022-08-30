public class Solution {
    public int[] loop(int a) {
        int[] output = new int[a];
        for (int i = 0; i < a; i++) {
            output[i] = i;
        }
        return output;
    }
}