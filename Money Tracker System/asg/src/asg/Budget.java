package asg;
import java.util.*;

public class Budget {
	private double limit;
	
	public Budget(double theLimit)
	{
		setLimit(theLimit);
	}
	
	public double getlimit()
	{
		return limit;
	}
	
	public void setLimit(double aLimit)
	{
		Scanner input=new Scanner(System.in);
		
		if( aLimit > 0 )
			limit= aLimit;
		else
			do {
				System.out.println("The budget must be greater than 0!");	
				System.out.println("Please enter the budget again");
				System.out.print("Budget: ");
				limit=input.nextInt();
				System.out.println();
			}while( limit <= 0 );	
	}

}