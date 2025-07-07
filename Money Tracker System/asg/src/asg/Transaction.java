package asg;
import java.util.*;

public class Transaction {
	protected double amount;
	protected int year;
	protected int month;
	protected int day;
	
	public Transaction(int year, int month, int day, double theAmount)
	{
		setYear(year);
		setMonth(month);
		setDay(day);
		setAmount(theAmount);
	}
	
	public double getAmount()
	{
		return amount;
	}
	
	public void setAmount(double aAmount)
	{
		Scanner input=new Scanner(System.in);
		
		if( aAmount > 0 )
			amount= aAmount;
		else
			do {
				System.out.println("The amount must be greater than 0!");	
				System.out.println("Please enter the amount again");
				System.out.print("Amount: ");
				amount=input.nextInt();
				System.out.println();
			}while( amount <= 0 );	
	}
	
	public int getDay()
	{
		return day;
	}
	
	public void setDay(int aDay)
	{
		Scanner input=new Scanner(System.in);
		
		if( aDay > 0 && aDay <= 31 )
			day= aDay;
		else
			do {
				System.out.println("The day can only be record from 1 to 31!");	
				System.out.println("Please enter the day again");
				System.out.print("Day (1-31): ");
				day=input.nextInt();
				System.out.println();
			}while( day <= 0 || day > 31 );

	}
	
	public int getMonth()
	{
		return month;
	}
	
	public void setMonth(int aMonth)
	{
		Scanner input=new Scanner(System.in);
		
		if( aMonth > 0 && aMonth <= 12)
			month=aMonth;
		else
			do {
				System.out.println("The month can only be record from 1 to 12!");	
				System.out.println("Please enter the month again");
				System.out.print("Month (1-12): ");
				month=input.nextInt();
				System.out.println();
			}while( month <= 0 || month >12 );
		
	}
	
	public int getYear()
	{
		return year;
	}
	
	public void setYear(int aYear)
	{
		Scanner input=new Scanner(System.in);
		
		if( aYear > 0 )
			year= aYear;
		else
			do {
				System.out.println("The year must be greater than 0!");	
				System.out.println("Please enter the year again");
				System.out.print("Year (eg. 2024): ");
				year=input.nextInt();
				System.out.println();
			}while( year <= 0 );
	}

}