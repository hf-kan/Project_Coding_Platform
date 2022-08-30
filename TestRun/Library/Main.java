import java.lang.reflect.*;
import java.util.*;

public class Main {
    public static void main (String[] args) throws Exception {
        // args[0] = method name to be tested
        // args[1] to args[n] = arguments to be passed to the method
        Solution solObj;
        Submission subObj;
        Class<?> solClass;
        Class<?> subClass;
        Method[] solMethodArray;
        Method solMethod;
        Method subMethod;
        Class<?>[] subParmTypes;
        String[] rawParms;
        Object[] processedParms;
        Object[] result = new Object[1];
        int noOfParms;
        boolean solMethodFound = false;

        try {
            solObj = new Solution();
            subObj = new Submission();
            solClass = solObj.getClass();
            subClass = subObj.getClass();
            solMethodArray = solClass.getMethods();
            // get first method from solution class with matching method name
            for (Method method : solMethodArray) {
                if (method.getName().equals(args[0])) {
                    solMethod = method;
                    solMethodFound = true;
                    // get expected method from submission with matching method signature
                    subMethod = subClass.getMethod(args[0], solMethod.getParameterTypes());
                    checkMethodReturnType(args[0], solMethod, subMethod);
                    subParmTypes = subMethod.getParameterTypes(); //get parameter type list
                    noOfParms = subParmTypes.length;
                    rawParms = getRawParameters(args, noOfParms);
                    processedParms = processParms(rawParms, subParmTypes);
                    result[0] = subMethod.invoke(subClass.getDeclaredConstructor().newInstance(), processedParms);
                    if (result[0].getClass().isArray()) {
                        System.out.println(Arrays.deepToString(result));
                    } else {
                        System.out.println(result[0]);
                    }
                    break;
                }
            }
            if (!solMethodFound) {
                System.out.println("Contact Lecturer: Invalid solution file, expected method name '" + args[0] + "' not found" );
                System.exit(1);
            }
        } catch (NoSuchMethodException e) {
            System.out.println("Expected method '" + args[0] + "' not found or has incorrect parameter type(s)." );
            System.exit(1);
        } catch (InvocationTargetException x) {
            System.out.println("Run Error: " + x.getCause());
            System.exit(1);
        }
    }

    private static String[] getRawParameters (String[] args, int noOfParms) {
        if (noOfParms > 0) {
            String[] output = new String[noOfParms];
            try {
                output = new String[noOfParms];
                for (int i = 0; i < noOfParms; i++) {
                    output[i] = args[i + 1].trim(); // offset by 1, as the first arg store method name
                }
            } catch (ArrayIndexOutOfBoundsException x) {
                System.out.println("Insufficient number of parameters provided. Expected # of parameters: " + noOfParms);
                System.exit(1);
            }
            return output;
        } else {
            return new String[0];
        }
    }

    private static void checkMethodReturnType (String methodName, Method sol, Method sub) {
        if (!sol.getReturnType().equals(sub.getReturnType())) {
            System.out.println("Method '" +
                    methodName + "' has incorrect return type. Expected to return: " +
                    sol.getReturnType().getTypeName());
            System.exit(1);
        }
    }

    private static Object[] processParms (String[] rawParms, Class[] parmTypes) {
        // Only handle primitive types parameters, others will be stored as String
        // if char, only pass check if the value length = 1
        ArrayList<Object> preOutput = new ArrayList<>();
        int count = 0;
        String currParm = "";
        String expectedType = "";
        try {
            for (String parm: rawParms) {
                currParm = parm;
                expectedType = parmTypes[count].getTypeName();
                if (parmTypes[count].equals(char.class)) {
                    if (parm.length() == 1) {
                        preOutput.add(parm.charAt(0));
                    } else {
                        throw new IllegalArgumentException();
                    }
                } else if (parmTypes[count].equals(int.class)) {
                    preOutput.add(Integer.parseInt(parm));
                } else if (parmTypes[count].equals(double.class)) {
                    preOutput.add(Double.parseDouble(parm));
                } else if (parmTypes[count].equals(byte.class)) {
                    preOutput.add(Byte.parseByte(parm));
                } else if (parmTypes[count].equals(short.class)) {
                    preOutput.add(Short.parseShort(parm));
                } else if (parmTypes[count].equals(long.class)) {
                    preOutput.add(Long.parseLong(parm));
                } else if (parmTypes[count].equals(float.class)) {
                    preOutput.add(Float.parseFloat(parm));
                } else if (parmTypes[count].equals(boolean.class)) {
                    preOutput.add(Boolean.parseBoolean(parm));
                } else {
                    preOutput.add(parm);
                }
                count = count + 1;
            }
        } catch (IllegalArgumentException e) {
            System.out.println("Invalid value '" + currParm +
                    "' for parameter #" + (count + 1) +
                    ". Expected type is: " + expectedType);
            System.exit(1);
        }
        return preOutput.toArray();
    }
}
