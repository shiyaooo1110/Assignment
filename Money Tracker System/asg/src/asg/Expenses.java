package asg;

public class Expenses extends Transaction{

    private String type;
	
	public Expenses(int year, int month, int day, double theAmount, String theType)
	{
		super(year, month, day, theAmount);
		type = theType;
	}

	public String getType()
	{
		return type;
	}
	
	public void setType(String aType)
	{
		type = aType;
	}

}
