package Trab1;

import java.util.Arrays;

public class Utils {
    public static void printArray(String mensagem, int[] arr) {
    	
    	Utils.printArray("Original: ", arr);
    	MergeSort.mergeSort(arr, 0, arr.length - 1);
    	Utils.printArray("Ordenado: ", arr);

        System.out.println(mensagem + Arrays.toString(arr));
    }
}

