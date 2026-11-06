package Trab1;

import java.util.Arrays;

public class App {
    public static void main(String[] args) {
        int[] arr = {38, 27, 43, 3, 9, 82, 10, 1};

        System.out.println("Original: " + Arrays.toString(arr));

        MergeSort.mergeSort(arr, 0, arr.length - 1);

        System.out.println("Ordenado: " + Arrays.toString(arr));
    }
}
